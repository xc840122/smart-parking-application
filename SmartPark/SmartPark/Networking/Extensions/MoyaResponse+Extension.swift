//
//  MoyaResponse+Extension.swift
//  SmartPark
//
//  Created by 阿福 on 14/03/2025.
//

import Foundation
import Moya

enum APIError: Error {
    case missingData
}

extension Moya.Response {
    func decode<T: Decodable>() throws -> T {
        let decodedResponse = try JSONDecoder().decode(APIResponse<T>.self, from: self.data)
        guard let responseData = decodedResponse.data else {
            throw APIError.missingData
        }
        return responseData
    }
    
    func isSuccess() -> Bool {
        guard let decodedResponse = try? JSONDecoder().decode(APIResponse<String>.self, from: self.data) else {
            return false
        }
        return decodedResponse.result
    }
}
