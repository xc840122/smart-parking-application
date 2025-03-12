//
//  ParkingSpotViewModel.swift
//  SmartPark
//
//  Created by 阿福 on 26/02/2025.
//

import Foundation
import Observation

@Observable
class ParkingSpotViewModel {
    var parkingLots: [ParkingSpot] = []
    
    var cities: [String] = []
    var areas: [String] = []
    var streets: [String] = []
    
    var selectedCity: String? = nil
    var selectedArea: String? = nil
    var selectedStreet: String? = nil
    
    @MainActor var errorMessage: String? = nil
    
    private let localService = ParkingSpotService()
    
    func loadParkingLots() async {
        do {
            parkingLots = try await localService.fetchParkingLots()
            areas = []
            streets = []
            selectedCity = nil
            selectedArea = nil
            selectedStreet = nil
            print("load local data: \(parkingLots.count)")
        } catch {
            dump(error.localizedDescription)
        }
    }
    
    func fetchCities() async {
        do {
            let result = try await localService.fetchCities()
            cities = result
            selectedCity = nil
            selectedArea = nil
            selectedStreet = nil
            areas = []
            streets = []
        } catch {
            print("Error fetching cities: \(error.localizedDescription)")
        }
    }
    
    func fetchAreas(for city: String) async {
        do {
            let result = try await localService.fetchAreas(for: city)
            areas = result
            selectedArea = nil
            selectedStreet = nil
            streets = []
            print("Fetched Areas: \(areas)")
        } catch {
            print("Error fetching areas: \(error.localizedDescription)")
        }
    }
    
    func fetchStreets(for area: String) async {
        do {
            let result = try await localService.fetchStreets(for: area)
            streets = result
            selectedStreet = nil
            print("Fetched streets: \(streets)")
        } catch {
            print("Error fetching streets: \(error.localizedDescription)")
        }
    }
    
    func searchParkingLots() async {
        do {
            let response = try await localService.fetchParkingLots(
                city: selectedCity,
                area: selectedArea,
                street: selectedStreet
            )
            parkingLots = response
            print("Search result: \(parkingLots.count) spots for city: \(selectedCity ?? "N/A"), area: \(selectedArea ?? "N/A"), street: \(selectedStreet ?? "N/A")")
        } catch {
            await MainActor.run {
                self.errorMessage = "Failed to load parking spots. Please try again."
            }
            print("Error searching parking lots: \(error.localizedDescription)")
        }
    }
}
