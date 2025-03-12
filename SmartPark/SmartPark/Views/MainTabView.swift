//
//  MainTabView.swift
//  SmartPark
//
//  Created by 阿福 on 24/02/2025.
//

import SwiftUI

struct MainTabView: View {
    var body: some View {
        TabView {
            Tab("Home", systemImage: "house.fill") {
                NavigationStack {
                    HomeView()
                }
            }
            
            Tab("Bookings", systemImage: "calendar") {
                BookingListView()
            }
            
            Tab("Billing", systemImage: "creditcard.fill") {
                BillingView()
            }
            
            Tab("Profile", systemImage: "person.fill") {
                ProfileView()
            }
        }
        .tint(.black)
    }
}

#Preview {
    MainTabView()
}
