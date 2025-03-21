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
                    SortingBar(viewModel: parkingSpotViewModel)
                    
                    if homeViewModel.isMapView {
                        MapView(parkingSpots: parkingSpotViewModel.parkingLots)
                            .frame(height: outerGeometry.size.height - 120)
                    } else {
                        LazyVStack(spacing: 8) {
                            if parkingSpotViewModel.parkingLots.isEmpty {
                                UnavailableView(title: "Sorry", subtitle: "No parking spots available", systemImage: "tray.fill")
                            } else {
                                ForEach(parkingSpotViewModel.parkingLots) { spot in
                                    NavigationLink(value: spot) {
                                        ParkingSpotRow(parkingSpot: spot)
                                    }
                                }
                            }
                        }
                    }
                }
            }
            .conditionalModifier(!homeViewModel.isMapView) { view in
                view.refreshable {
                    await parkingSpotViewModel.loadParkingLots()
                    await parkingSpotViewModel.fetchCities()
                }
            }
            .alert(parkingSpotViewModel.errorMessage ?? "", isPresented: Binding(
                get: { parkingSpotViewModel.errorMessage != nil },
                set: { _ in parkingSpotViewModel.errorMessage = nil }
            )) {
                Button("OK", role: .cancel) {}
            }
        }
        .task {
            // Initial data loading
            await parkingSpotViewModel.loadParkingLots()
            await parkingSpotViewModel.fetchCities()
        }
        .navigationDestination(for: ParkingSpot.self) { spot in
            ParkingSpotDetailView(parkingSpot: spot)
        }
        .navigationTitle("Find Parking")
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .navigationBarTrailing) {
                Button {
                    homeViewModel.isMapView.toggle()
                } label: {
                    Image(systemName: homeViewModel.isMapView ? "list.bullet" : "map")
                        .font(.title2)
                        .foregroundColor(.black)
                }
            }
        }
        .overlay(
            parkingSpotViewModel.isLoading ? AnyView(LoadingView(title: "Loading...").transition(.opacity)) : AnyView(EmptyView())
        )
        .animation(.easeInOut, value: parkingSpotViewModel.isLoading)
    }
}

#Preview {
    NavigationView {
        HomeView()
    }
}
