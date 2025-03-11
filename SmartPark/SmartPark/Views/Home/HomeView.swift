//
//  HomeView.swift
//  SmartPark
//
//  Created by 阿福 on 26/02/2025.
//

import SwiftUI

struct HomeView: View {
    @State private var homeViewModel = HomeViewModel()
    @State private var parkingSpotViewModel = ParkingSpotViewModel()
    
    var body: some View {
        GeometryReader { outerGeometry in
            ScrollView {
                VStack {
                    SearchBar(searchText: $homeViewModel.searchText)
                    SortingBar(selectedFilter: $homeViewModel.selectedFilter, isMapView: $homeViewModel.isMapView)
                    
                    if homeViewModel.isMapView {
                        MapView()
                            .frame(height: outerGeometry.size.height - 120)
                    } else {
                        LazyVStack(spacing: 8) {
                            if parkingSpotViewModel.parkingLots.isEmpty {
                                ContentUnavailableView("No parking spots available", systemImage: "car.slash")
                            } else {
                                ForEach(parkingSpotViewModel.parkingLots) { spot in
                                    ParkingSpotRow(parkingSpot: spot)
                                }
                            }
                        }
                    }
                }
            }
            .conditionalModifier(!homeViewModel.isMapView) { view in
                view.refreshable {
                    await parkingSpotViewModel.loadParkingLots()
                }
            }
            
        }
        .task {
            // Initial data loading
            await parkingSpotViewModel.loadParkingLots()
        }
        .navigationTitle("Find Parking")
        .navigationBarTitleDisplayMode(.inline)
    }
}

#Preview {
    NavigationView {
        HomeView()
    }
}
