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
    @State private var currentRegion: MKCoordinateRegion

    @State private var selectedSpot: ParkingSpot?
    @State private var showNavigationAlert = false

    var parkingSpots: [ParkingSpot]

    init(parkingSpots: [ParkingSpot]) {
        self.parkingSpots = parkingSpots

        if !parkingSpots.isEmpty {
            let calculatedRegion = MapView.calculateRegion(for: parkingSpots)
            _cameraPosition = State(initialValue: .region(calculatedRegion))
            _currentRegion = State(initialValue: calculatedRegion)
        } else {
            let defaultRegion = MKCoordinateRegion(
                center: CLLocationCoordinate2D(latitude: 0.0, longitude: 0.0),
                span: MKCoordinateSpan(latitudeDelta: 0.5, longitudeDelta: 0.5)
            )
            _cameraPosition = State(initialValue: .region(defaultRegion))
            _currentRegion = State(initialValue: defaultRegion)
        }
    }

    var body: some View {
        ZStack {
            Map(position: $cameraPosition) {
                ForEach(parkingSpots) { spot in
                    Annotation(spot.name, coordinate: CLLocationCoordinate2D(latitude: spot.location.lat, longitude: spot.location.lng)) {
                        markerView(for: spot)
                    }
                }
            }
            .onMapCameraChange { context in
                currentRegion = context.region  // Store the current region when the user moves the map
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

    /// **Handles map marker selection**
    private func markerView(for spot: ParkingSpot) -> some View {
        VStack {
            Image(systemName: "mappin.circle.fill")
                .font(.title)
                .foregroundStyle(.red)
                .onTapGesture {
                    selectedSpot = spot
                    showNavigationAlert = true
                }

            Text(spot.name)
                .font(.caption)
                .padding(4)
                .background(Color.white)
                .clipShape(RoundedRectangle(cornerRadius: 5))
                .shadow(radius: 2)
        }
    }

    /// **Zoom in the map by reducing the span**
    private func zoomIn() {
        let newLatDelta = max(currentRegion.span.latitudeDelta * 0.5, 0.002) // Prevent zooming too much
        let newLngDelta = max(currentRegion.span.longitudeDelta * 0.5, 0.002)

        updateCameraPosition(latDelta: newLatDelta, lngDelta: newLngDelta)
    }

    /// **Zoom out the map by increasing the span**
    private func zoomOut() {
        let newLatDelta = min(currentRegion.span.latitudeDelta * 2, 50) // Prevent zooming too far out
        let newLngDelta = min(currentRegion.span.longitudeDelta * 2, 50)

        updateCameraPosition(latDelta: newLatDelta, lngDelta: newLngDelta)
    }

    /// **Update the camera position while maintaining the center**
    private func updateCameraPosition(latDelta: Double, lngDelta: Double) {
        let newRegion = MKCoordinateRegion(
            center: currentRegion.center,
            span: MKCoordinateSpan(latitudeDelta: latDelta, longitudeDelta: lngDelta)
        )

        cameraPosition = .region(newRegion)
        currentRegion = newRegion
    }

    /// **Calculate a suitable map region that fits all parking spots**
    static private func calculateRegion(for spots: [ParkingSpot]) -> MKCoordinateRegion {
        let latitudes = spots.map { $0.location.lat }
        let longitudes = spots.map { $0.location.lng }
        
        let minLat = latitudes.min() ?? 0.0
        let maxLat = latitudes.max() ?? 0.0
        let minLng = longitudes.min() ?? 0.0
        let maxLng = longitudes.max() ?? 0.0
        
        let centerLat = (minLat + maxLat) / 2
        let centerLng = (minLng + maxLng) / 2
        
        let latDelta = max((maxLat - minLat) * 1.2, 0.05)
        let lngDelta = max((maxLng - minLng) * 1.2, 0.05)

        return MKCoordinateRegion(
            center: CLLocationCoordinate2D(latitude: centerLat, longitude: centerLng),
            span: MKCoordinateSpan(latitudeDelta: latDelta, longitudeDelta: lngDelta)
        )
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
            UIApplication.shared.open(webURL)
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
        ),
        ParkingSpot(
            id: "test2",
            creationTime: 0,
            name: "Another Parking",
            area: "Another Area",
            city: "Another City",
            street: "Another Street",
            unit: "Test Unit",
            availableSlots: 10,
            totalSlots: 20,
            pricePerHour: 5,
            location: PLocation(lat: 35.0, lng: -118.0),
            isActive: true
        )
    ])
}
