import pandas as pd
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.metrics import mean_squared_error
import joblib

# load data
def load_data(file_path):
    data = pd.read_csv(file_path)
    return data

# preprocess data
def preprocess_data(data):
    # features and target variable
    X = data.drop(columns=['discount_rate', 'timestamp'])  # features
    y = data['discount_rate']  # target variable

    # categorical and numerical features
    categorical_features = ['day_of_week', 'is_weekend']
    numerical_features = ['duration', 'cost', 'occupancy_rate', 'time_of_day']

    # preprocessor
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), numerical_features),  # standardize numerical features
            ('cat', OneHotEncoder(), categorical_features)  # classify categorical features
        ])

    return X, y, preprocessor

# train model
def train_model(X, y, preprocessor):
    # separate training and testing data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # initialize model
    model = RandomForestRegressor(random_state=42)

    # create pipeline
    pipeline = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('model', model)
    ])

    # define hyperparameters grid
    param_grid = {
        'model__n_estimators': [50, 100, 200],
        'model__max_depth': [None, 10, 20],
        'model__min_samples_split': [2, 5, 10]
    }

    # grid search
    grid_search = GridSearchCV(pipeline, param_grid, cv=5, scoring='neg_mean_squared_error')
    grid_search.fit(X_train, y_train)

    # best parameters
    print("Best parameters:", grid_search.best_params_)

    # use best parameters to train model again
    best_model = grid_search.best_estimator_

    # predict
    y_pred = best_model.predict(X_test)

    # estimate the mean squared error
    mse = mean_squared_error(y_test, y_pred)
    print(f"(MSE) after optimization: {mse}")

    return best_model

# save model
def save_model(model, preprocessor, model_path, preprocessor_path):
    joblib.dump(model, model_path)
    joblib.dump(preprocessor, preprocessor_path)
    print(f"Model save to {model_path}")
    print(f"Preprocessor_path save to {preprocessor_path}")

# main function
if __name__ == '__main__':
    # load data
    data = load_data('parking_data_cleaned.csv')

    # preprocess data
    X, y, preprocessor = preprocess_data(data)

    # train model
    best_model = train_model(X, y, preprocessor)

    # save models
    save_model(best_model, preprocessor, 'parking_model.pkl', 'preprocessor.pkl')