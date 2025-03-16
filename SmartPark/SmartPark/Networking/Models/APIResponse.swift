//
//  APIResponse.swift
//  SmartPark
//
//  Created by 阿福 on 12/03/2025.
//

import Foundation

struct APIResponse<T: Decodable>: Decodable {
    let result: Bool
    let message: String
    let data: T?
}
