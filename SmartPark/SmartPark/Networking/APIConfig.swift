//
//  APIConfig.swift
//  SmartPark
//
//  Created by 阿福 on 26/02/2025.
//

import Foundation

enum APIConfig {
    enum Environment {
        case development
        case production
    }
    
    static var currentEnvironment: Environment {
#if DEBUG
        return .development
#else
        return .production
#endif
    }
    
    static var baseURL: URL {
        switch currentEnvironment {
        case .development:
            return URL(string: "http://localhost:3000/api")!
        case .production:
            return URL(string: "https://example.com/api")!
        }
    }
    
    static var requestTimeout: TimeInterval {
        30.0
    }
}
