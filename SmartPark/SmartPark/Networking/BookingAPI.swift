//
//  BookingAPI.swift
//  SmartPark
//
//  Created by 阿福 on 12/03/2025.
//

import Foundation
import Moya

/// API Endpoints for Booking
enum BookingAPI {
    case createBooking(parkingSpotId: String, startTime: Int64, endTime: Int64)
}

extension BookingAPI: TargetType {
    var baseURL: URL {
        return URL(string: "http://localhost:3000/api")!
    }

    var path: String {
        switch self {
        case .createBooking:
            return "/booking"
        }
    }

    var method: Moya.Method {
        return .post
    }

    var task: Task {
        switch self {
        case .createBooking(let parkingSpotId, let startTime, let endTime):
            let params: [String: Any] = [
                "id": parkingSpotId,
                "startTime": startTime,
                "endTime": endTime
            ]
            return .requestParameters(parameters: params, encoding: JSONEncoding.default)
        }
    }

    var headers: [String: String]? {
        nil
    }
}
