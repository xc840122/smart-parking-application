//
//  ParkingSpotDetailView.swift
//  SmartPark
//
//  Created by 阿福 on 12/03/2025.
//

import SwiftUI

struct ParkingSpotDetailView: View {
    let parkingSpot: ParkingSpot

    var body: some View {
        VStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 16) {
                    // **Parking spot name**
                    Text(parkingSpot.name)
                        .font(.title2)
                        .bold()
                        .padding(.bottom, 5)

                    // **City & Area**
                    HStack {
                        infoBox(title: "City", value: parkingSpot.city)
                        infoBox(title: "Area", value: parkingSpot.area)
                    }

                    // **Street & Unit**
                    HStack {
                        infoBox(title: "Street", value: parkingSpot.street)
                        infoBox(title: "Unit", value: parkingSpot.unit)
                    }

                    // **Available & Total Slots**
                    HStack {
                        infoBox(title: "Available Slots", value: "\(parkingSpot.availableSlots) / \(parkingSpot.totalSlots)")
                        infoBox(title: "Price", value: "$\(String(format: "%.2f", parkingSpot.pricePerHour))/hr")
                    }

                    // **Location Map**
                    VStack(alignment: .leading, spacing: 6) {
                        Text("Location")
                            .font(.headline)
                            .foregroundColor(.gray)

                        MapView(parkingSpots: [parkingSpot])
                            .frame(height: 200)
                            .clipShape(RoundedRectangle(cornerRadius: 12))
                            .overlay(RoundedRectangle(cornerRadius: 12).stroke(Color.gray.opacity(0.3), lineWidth: 1))
                    }
                    .padding()
                }
                .padding()
            }

            VStack {
                Button(action: {
                    bookParkingSpot()
                }) {
                    Text("Book Now")
                        .font(.headline)
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(Color.black)
                        .clipShape(RoundedRectangle(cornerRadius: 12))
                }
                .padding(.horizontal)
                .padding(.bottom, 10)
            }
            .background(Color(UIColor.systemBackground)) // ✅ Ensure button has background
        }
        .navigationTitle("Parking Details")
        .navigationBarTitleDisplayMode(.inline)
    }

    private func infoBox(title: String, value: String) -> some View {
        VStack(alignment: .leading, spacing: 4) {
            Text(title.uppercased())
                .font(.caption)
                .foregroundColor(.gray)
            Text(value)
                .font(.system(.title3, design: .monospaced))
                .bold()
                .foregroundColor(.primary)
        }
        .padding()
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(RoundedRectangle(cornerRadius: 12).stroke(Color.gray.opacity(0.3), lineWidth: 1))
    }

    // **Booking action (Navigate to booking view)**
    private func bookParkingSpot() {
        print("Booking: \(parkingSpot.name)")
        // Implement navigation to booking screen, e.g.,
    }
}

#Preview {
    NavigationView {
        ParkingSpotDetailView(parkingSpot: ParkingSpot(
            id: "test",
            creationTime: 1741686092825.4688,
            name: "Test Parking Spot",
            area: "Downtown",
            city: "New York",
            street: "Main St",
            unit: "123",
            availableSlots: 5,
            totalSlots: 20,
            pricePerHour: 8.5,
            location: PLocation(lat: 40.7128, lng: -74.0060),
            isActive: true
        ))
    }
}
