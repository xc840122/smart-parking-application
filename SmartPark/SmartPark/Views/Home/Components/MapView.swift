//
//  MapView.swift
//  SmartPark
//
//  Created by 阿福 on 26/02/2025.
//

import SwiftUI
import MapKit

struct MapView: View {
    @State private var cameraPosition: MapCameraPosition
    @State private var zoomLevel: Double = 0.5
    @State private var currentCenter: CLLocationCoordinate2D
    @State private var selectedSpot: ParkingSpot?
    @State private var showNavigationAlert = false  // Controls whether the alert is displayed

    var parkingSpots: [ParkingSpot]

    init(parkingSpots: [ParkingSpot]) {
        self.parkingSpots = parkingSpots
        if let firstSpot = parkingSpots.first {
            let initialCenter = CLLocationCoordinate2D(latitude: firstSpot.location.lat, longitude: firstSpot.location.lng)
            _cameraPosition = State(initialValue: .region(MKCoordinateRegion(
                center: initialCenter,
                span: MKCoordinateSpan(latitudeDelta: 0.5, longitudeDelta: 0.5)
            )))
            _currentCenter = State(initialValue: initialCenter)
        } else {
            _cameraPosition = State(initialValue: .automatic)
            _currentCenter = State(initialValue: CLLocationCoordinate2D(latitude: 0.0, longitude: 0.0))
        }
    }

    var body: some View {
        ZStack {
            Map(position: $cameraPosition) {
                ForEach(parkingSpots) { spot in
                    Annotation(spot.name, coordinate: CLLocationCoordinate2D(latitude: spot.location.lat, longitude: spot.location.lng)) {
                        VStack {
                            Image(systemName: "mappin.circle.fill")
                                .font(.title)
                                .foregroundStyle(.red)
                                .onTapGesture {
                                    selectedSpot = spot
                                    showNavigationAlert = true  // Show alert before navigation
                                }

                            Text(spot.name)
                                .font(.caption)
                                .padding(4)
                                .background(Color.white)
                                .clipShape(RoundedRectangle(cornerRadius: 5))
                                .shadow(radius: 2)
                        }
                    }
                }
            }
            .onMapCameraChange { context in
                currentCenter = context.region.center  // Store the current center when the user moves the map
            }
            .alert("Navigation", isPresented: $showNavigationAlert) {
                Button("Cancel", role: .cancel) { }
                Button("Google Maps") {
                    if let spot = selectedSpot {
                        openInGoogleMaps(spot: spot)
                    }
                }
                Button("Apple Maps") {
                    if let spot = selectedSpot {
                        openInAppleMaps(spot: spot)
                    }
                }
            } message: {
                if let spot = selectedSpot {
                    Text("Do you want to navigate to \(spot.name)?")
                }
            }

            // Zoom buttons
            VStack {
                Spacer()
                HStack {
                    Spacer()
                    VStack(spacing: 10) {
                        Button(action: { zoomIn() }) {
                            Image(systemName: "plus.magnifyingglass")
                                .padding()
                                .background(Color.white)
                                .clipShape(Circle())
                                .shadow(radius: 2)
                        }

                        Button(action: { zoomOut() }) {
                            Image(systemName: "minus.magnifyingglass")
                                .padding()
                                .background(Color.white)
                                .clipShape(Circle())
                                .shadow(radius: 2)
                        }
                    }
                    .padding()
                }
            }
        }
    }

    private func zoomIn() {
        zoomLevel = max(zoomLevel / 2, 0.01)
        updateCameraPosition()
    }

    private func zoomOut() {
        zoomLevel = min(zoomLevel * 2, 5)
        updateCameraPosition()
    }

    private func updateCameraPosition() {
        cameraPosition = .region(MKCoordinateRegion(
            center: currentCenter,  // Maintain current center when zooming
            span: MKCoordinateSpan(latitudeDelta: zoomLevel, longitudeDelta: zoomLevel)
        ))
    }

    private func openInAppleMaps(spot: ParkingSpot) {
        let latitude = spot.location.lat
        let longitude = spot.location.lng
        let url = URL(string: "http://maps.apple.com/?daddr=\(latitude),\(longitude)&dirflg=d")!

        if UIApplication.shared.canOpenURL(url) {
            UIApplication.shared.open(url)
        }
    }

    private func openInGoogleMaps(spot: ParkingSpot) {
        let latitude = spot.location.lat
        let longitude = spot.location.lng
        let googleMapsURL = URL(string: "comgooglemaps://?daddr=\(latitude),\(longitude)&directionsmode=driving")!
        let webURL = URL(string: "https://www.google.com/maps/dir/?api=1&destination=\(latitude),\(longitude)")!

        if UIApplication.shared.canOpenURL(googleMapsURL) {
            UIApplication.shared.open(googleMapsURL)
        } else {
            UIApplication.shared.open(webURL)  // Open Google Maps in browser if app is not installed
        }
    }
}

#Preview {
    MapView(parkingSpots: [
        ParkingSpot(
            id: "test",
            creationTime: 0,
            name: "Test Parking",
            area: "Test Area",
            city: "Test City",
            street: "Test Street",
            unit: "Test Unit",
            availableSlots: 5,
            totalSlots: 10,
            pricePerHour: 2,
            location: PLocation(lat: 34.0, lng: -117.0),
            isActive: true
        )
    ])
}
