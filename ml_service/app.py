from fastapi import FastAPI
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.metrics import silhouette_score

app = FastAPI()

@app.post("/cluster")
def cluster_user(data: dict):
    df = pd.DataFrame(data["transactions"])

    # Filter only expense transactions for spending behavior analysis
    if 'type' in df.columns:
        df = df[df['type'] == 'EXPENSE']

    if df.empty:
        return {"error": "No expense transactions found for clustering"}

    # ---------- feature engineering ----------
    df['date'] = pd.to_datetime(df['date'])
    df = df.sort_values('date')

    df['hour'] = df['date'].dt.hour
    df['day_of_week'] = df['date'].dt.dayofweek
    df['is_weekend'] = df['day_of_week'].isin([5, 6]).astype(int)

    def time_bucket(h):
        if 5 <= h < 12:
            return 'morning'
        elif 12 <= h < 17:
            return 'afternoon'
        elif 17 <= h < 21:
            return 'night'
        else:
            return 'late_night'

    df['time_bucket'] = df['hour'].apply(time_bucket)

    df['year_month'] = df['date'].dt.to_period('M')
    monthly_avg = df.groupby('year_month')['amount'].transform('mean')
    df['amount_normalized'] = df['amount'] / monthly_avg

    df['category_freq'] = (
        df.groupby(['year_month', 'category'])['category']
        .transform('count')
    )

    # ---------- ML pipeline ----------
    num_cols = ['amount_normalized', 'category_freq', 'is_weekend']
    cat_cols = ['time_bucket']

    preprocessor = ColumnTransformer([
        ('num', StandardScaler(), num_cols),
        ('cat', OneHotEncoder(drop='first', sparse_output=False), cat_cols)
    ])

    scores = {}
    models = {}

    for k in range(2, 6):
        pipeline = Pipeline([
            ('prep', preprocessor),
            ('km', KMeans(n_clusters=k, random_state=42, n_init=10))
        ])

        labels = pipeline.fit_predict(df)
        X_proc = pipeline.named_steps['prep'].transform(df)
        scores[k] = silhouette_score(X_proc, labels)
        models[k] = labels

    best_k = max(scores, key=scores.get)

    df['cluster'] = models[best_k]

    # ---------- cluster profiling and interpretation ----------
    cluster_profile = (
        df.groupby('cluster')
        .agg({
            'amount_normalized': 'mean',
            'category_freq': 'mean',
            'is_weekend': 'mean'
        })
        .reset_index()
    )

    def interpret_cluster(row):
        if row['category_freq'] > 4 and row['amount_normalized'] < 1:
            return "Routine Spending"
        elif row['amount_normalized'] > 1.5:
            return "Planned High-Value Spending"
        else:
            return "Discretionary / Impulse Spending"

    cluster_profile['label'] = cluster_profile.apply(interpret_cluster, axis=1)

    cluster_label_map = dict(
        zip(cluster_profile['cluster'], cluster_profile['label'])
    )

    df['cluster_label'] = df['cluster'].map(cluster_label_map)

    # Calculate additional insights
    total_expenses = len(df)
    impulse_count = len(df[df['cluster_label'] == "Discretionary / Impulse Spending"])
    impulse_percentage = (impulse_count / total_expenses) * 100 if total_expenses > 0 else 0

    # Time bias
    weekend_spend = df[df['is_weekend'] == 1]['amount'].sum()
    total_spend = df['amount'].sum()
    weekend_percentage = (weekend_spend / total_spend) * 100 if total_spend > 0 else 0

    # Habitual behavior
    habitual_count = len(df[df['category_freq'] > 4])
    habitual_percentage = (habitual_count / total_expenses) * 100 if total_expenses > 0 else 0

    return {
        "best_k": best_k,
        "silhouette_scores": scores,
        "cluster_summary": cluster_profile.to_dict(orient="records"),
        "transactions": df.to_dict(orient="records"),
        "insights": {
            "impulse_percentage": impulse_percentage,
            "weekend_percentage": weekend_percentage,
            "habitual_percentage": habitual_percentage
        }
    }
