//
//  NavigationManager.swift
//  SmartPark
//
//  Created by 阿福 on 16/03/2025.
//

import SwiftUI

@Observable
class NavigationManager: ObservableObject {
    var homePath = NavigationPath()
    var bookingsPath = NavigationPath()
    var billingPath = NavigationPath()
    var profilePath = NavigationPath()

    func resetToRoot(tab: String) {
        switch tab {
        case "Home":
            homePath = NavigationPath()
        case "Bookings":
            bookingsPath = NavigationPath()
        case "Billing":
            billingPath = NavigationPath()
        case "Profile":
            profilePath = NavigationPath()
        default:
            break
        }
    }
}
