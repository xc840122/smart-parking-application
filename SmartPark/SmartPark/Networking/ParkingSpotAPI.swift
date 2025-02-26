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
            return "/parking-lots"
        }
    }

    var method: Moya.Method {
        .get
    }

    var task: Moya.Task {
        .requestPlain
    }

    var headers: [String : String]? {
        nil
    }
}
