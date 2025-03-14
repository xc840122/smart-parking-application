//
//  Calculation.swift
//  SmartPark
//
//  Created by 阿福 on 14/03/2025.
//

import Foundation

struct Calculation: Codable, Hashable {
    let bookingId: String
    let dicountRate: Double
    let totalCost: Double
}
