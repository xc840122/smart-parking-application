//
//  ViewExtensions.swift
//  SmartPark
//
//  Created by 阿福 on 11/03/2025.
//

import SwiftUI

extension View {
    @ViewBuilder
    func conditionalModifier<T: View>(_ condition: Bool, modifier: (Self) -> T) -> some View {
        if condition {
            modifier(self)
        } else {
            self
        }
    }
}
