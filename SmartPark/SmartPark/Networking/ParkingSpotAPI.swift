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
    case getCities
    case getAreas(city: String)
    case getStreets(area: String)
    case getParkingLotsFiltered(city: String?, area: String?, street: String?)
}

extension ParkingSpotAPI: TargetType {
    var baseURL: URL {
        APIConfig.baseURL
    }

    var path: String {
        switch self {
        case .getParkingLots, .getParkingLotsFiltered:
            return "/parking"
        case .getCities:
            return "/city"
        case .getAreas:
            return "/area"
        case .getStreets:
            return "/street"
        }
    }

    var method: Moya.Method {
        .get
    }

    var task: Moya.Task {
        switch self {
        case .getParkingLots:
            return .requestParameters(parameters: ["isActive": "true"], encoding: URLEncoding.queryString)
        case .getCities:
            return .requestPlain
        case .getAreas(let city):
            return .requestParameters(parameters: ["city": city], encoding: URLEncoding.queryString)
        case .getStreets(let area):
            return .requestParameters(parameters: ["area": area], encoding: URLEncoding.queryString)
        case .getParkingLotsFiltered(let city, let area, let street):
            var parameters: [String: String] = ["isActive": "true"]
            if let city = city { parameters["city"] = city }
            if let area = area { parameters["area"] = area }
            if let street = street { parameters["street"] = street }
            return .requestParameters(parameters: parameters, encoding: URLEncoding.queryString)
        }
    }

    var headers: [String : String]? {
        nil
    }
}
