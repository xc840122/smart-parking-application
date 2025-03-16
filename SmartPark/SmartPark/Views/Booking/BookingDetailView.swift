//
//  BookingDetailView.swift
//  SmartPark
//
//  Created by 阿福 on 16/03/2025.
//

import SwiftUI

struct BookingDetailView: View {
    let booking: Booking

    var body: some View {
        VStack(alignment: .leading, spacing: 20) {
            // Details Section
            VStack(spacing: 15) {
                DetailRow(label: "Parking Location", value: booking.parkingName, valueColor: .black)
                DetailRow(label: "Start Time", value: booking.formattedStartTime, valueColor: .primary)
                DetailRow(label: "End Time", value: booking.formattedEndTime, valueColor: .primary)
                DetailRow(label: "Total Cost", value: "$\(String(format: "%.2f", booking.totalCost))", valueColor: .green)
                DetailRow(label: "Discount Rate", value: "\(Int(booking.discountRate * 100))%", valueColor: .blue)
                DetailRow(label: "State", value: booking.state.capitalized, valueColor: .orange)
            }
            .padding(.top, 10)
            
            Spacer()
        }
        .padding(.horizontal)
        .background(Color.white)
        .cornerRadius(12)
        .shadow(color: Color.black.opacity(0.1), radius: 6, x: 0, y: 4)
        .navigationBarTitle("Booking Details", displayMode: .inline)
        .padding()
    }
}

struct DetailRow: View {
    let label: String
    let value: String
    let valueColor: Color

    var body: some View {
        HStack {
            Text(label)
                .font(.subheadline)
                .fontWeight(.semibold)
                .foregroundColor(.gray)
                .frame(width: 120, alignment: .leading)
            
            Spacer()
            
            Text(value)
                .font(.subheadline)
                .foregroundColor(valueColor) // Using custom color for value text
        }
        .padding(.vertical, 12)
        .background(Color.white)
        .cornerRadius(8)
    }
}

#Preview {
    BookingDetailView(booking: Booking(
        id: "123",
        discountRate: 0.28,
        endTime: 1742028589000,
        parkingName: "Downtown 5th Ave Parking",
        parkingSpaceId: "k576marh78evwmsnk8n4hd7fen7c0q1q",
        startTime: 1742020849000,
        state: "pending",
        totalCost: 18.0,
        updatedAt: 1742014313054,
        userId: "k1793z0eqng20fnf21vtzcmedn7c175j",
        creationTime: nil
    ))
}
