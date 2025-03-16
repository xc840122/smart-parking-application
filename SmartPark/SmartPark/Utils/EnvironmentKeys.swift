//
//  EnvironmentKeys.swift
//  SmartPark
//
//  Created by 阿福 on 16/03/2025.
//

import SwiftUI

private struct SelectedTabKey: EnvironmentKey {
    static let defaultValue: Binding<String> = .constant("Home")
}

extension EnvironmentValues {
    var selectedTab: Binding<String> {
        get { self[SelectedTabKey.self] }
        set { self[SelectedTabKey.self] = newValue }
    }
}
