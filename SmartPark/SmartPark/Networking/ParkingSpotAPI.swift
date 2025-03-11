//
//  ParkingSpotAPI.swift
//  SmartPark
//
//  Created by 阿福 on 26/02/2025.
//

import Foundation
import Moya

enum ParkingSpotAPI {
    case getParkingLots
}

extension ParkingSpotAPI: TargetType {
    var baseURL: URL {
        APIConfig.baseURL
    }

    var path: String {
        switch self {
        case .getParkingLots:
            return "/parking"
        }
    }

    var method: Moya.Method {
        .get
    }

    var task: Moya.Task {
        switch self {
        case .getParkingLots:
            return .requestParameters(parameters: ["isActive": "true"], encoding: URLEncoding.queryString)
        }
    }

    var headers: [String : String]? {
        nil
    }
    
    var sampleData: Data {
        guard let url = Bundle.main.url(forResource: "parkingLots", withExtension: "json"), let data = try? Data(contentsOf: url) else {
            print("⚠️ no parkingLots.json file")
            return Data()
        }
        return data
    }
}
