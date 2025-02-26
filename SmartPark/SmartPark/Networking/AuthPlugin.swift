//
//  AuthPlugin.swift
//  SmartPark
//
//  Created by 阿福 on 26/02/2025.
//

import Foundation
import Moya

struct AuthPlugin: PluginType {
    func prepare(_ request: URLRequest, target: any TargetType) -> URLRequest {
        var request = request
        
        request.addValue("application/json", forHTTPHeaderField: "application/json")
        
        return request
    }
}
