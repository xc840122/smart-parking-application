//
//  LocalParkingSpotService.swift
//  SmartPark
//
//  Created by 阿福 on 26/02/2025.
//

import Foundation

class LocalParkingSpotService {
    func fetchParkingLots() async throws -> [ParkingSpot] {
        guard let url = Bundle.main.url(forResource: "parkingLots", withExtension: "json") else {
            throw NSError(domain: "LocalFileError", code: 404, userInfo: [NSLocalizedDescriptionKey: "no parkingLots.json file"])
        }
        
        let data = try Data(contentsOf: url)
        let parkingLots = try JSONDecoder().decode([ParkingSpot].self, from: data)
        return parkingLots
    }
}
