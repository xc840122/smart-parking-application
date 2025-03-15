//
//  TimePickerView.swift
//  SmartPark
//
//  Created by 阿福 on 15/03/2025.
//

import SwiftUI

struct TimePickerView: View {
    var title: String
        @Binding var selection: Date
        var range: PartialRangeFrom<Date>

        var body: some View {
            VStack(alignment: .leading, spacing: 12) {
                Text(title)
                    .font(.system(size: 16, weight: .medium))
                    .foregroundColor(.black)
                    .frame(maxWidth: .infinity, alignment: .leading)

                DatePicker("", selection: $selection, in: range, displayedComponents: [.date, .hourAndMinute])
                    .labelsHidden()
                    .datePickerStyle(.wheel)
                    .frame(maxWidth: .infinity)
                    .frame(height: 120)
                    .clipped()
            }
        }
}

