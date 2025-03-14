//
//  ParkingSpotService.swift
//  SmartPark
//
//  Created by 阿福 on 26/02/2025.
//

import Foundation
import Moya

class ParkingSpotService {
    private let provider = MoyaProvider<ParkingSpotAPI>(plugins: [AuthPlugin()])
    
    func fetchParkingLots() async throws -> [ParkingSpot] {
        let response = try await provider.requestAsync(.getParkingLots)
        return try response.decode()
    }
    
    func fetchCities() async throws -> [String] {
        let response = try await provider.requestAsync(.getCities)
        return try response.decode()
    }
    
    func fetchAreas(for city: String) async throws -> [String] {
        let response = try await provider.requestAsync(.getAreas(city: city))
        return try response.decode()
    }
    
    func fetchStreets(for area: String) async throws -> [String] {
        let response = try await provider.requestAsync(.getStreets(area: area))
        return try response.decode()
    }
    
    func fetchParkingLots(city: String? = nil, area: String? = nil, street: String? = nil) async throws -> [ParkingSpot] {
        let response = try await provider.requestAsync(.getParkingLotsFiltered(city: city, area: area, street: street))
        if let requestURL = response.request?.url?.absoluteString {
            print("🔗 Request URL: \(requestURL)")
        }
        return try response.decode()
    }
}
