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
    case priceCalculation(clerkUserId: String ,parkingSpotId: String, startTime: Int64, endTime: Int64)
    case createBooking(bookingId: String, clerkUserId: String)
}

extension BookingAPI: TargetType {
    var baseURL: URL {
        return URL(string: "http://localhost:3000/api")!
    }

    var path: String {
        switch self {
        case .priceCalculation:
            return "/booking/cost"
        case .createBooking:
            return "/booking/confirm"
        }
    }

    var method: Moya.Method {
        return .post
    }

    var task: Task {
        switch self {
        case .priceCalculation(let clerkUserId, let parkingSpotId, let startTime, let endTime):
            let params: [String: Any] = [
                "clerkUserId": clerkUserId,
                "parkingSpaceId": parkingSpotId,
                "startTime": startTime,
                "endTime": endTime
            ]
            return .requestParameters(parameters: params, encoding: JSONEncoding.default)
        case .createBooking(let bookingId, let clerkUserId):
            let params: [String: Any] = [
                "bookingId": bookingId,
                "clerkUserId": clerkUserId,
            ]
            return .requestParameters(parameters: params, encoding: JSONEncoding.default)
        }
    }

    var headers: [String: String]? {
        nil
    }
}
