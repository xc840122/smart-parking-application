//
//  BookingListView.swift
//  SmartPark
//
//  Created by 阿福 on 26/02/2025.
//

import SwiftUI

struct BookingListView: View {
    @State private var viewModel = BookingListViewModel()
    
    var body: some View {
        NavigationStack {
            VStack {
                if viewModel.isLoading && viewModel.bookings.isEmpty {
                    HStack {
                        Spacer()
                        ProgressView("Loading...")
                            .progressViewStyle(CircularProgressViewStyle(tint: Color.black))
                            .scaleEffect(1.5)
                        Spacer()
                    }
                    .padding()
                    .background(Color.white)
                } else if let errorMessage = viewModel.errorMessage {
                    VStack {
                        Image(systemName: "exclamationmark.triangle.fill")
                            .resizable()
                            .scaledToFit()
                            .frame(width: 80, height: 80)
                            .foregroundColor(.red)
                        Text(errorMessage)
                            .font(.title2)
                            .foregroundColor(.gray)
                            .padding()
                    }
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
                    .background(Color.white)
                    .cornerRadius(10)
                } else if viewModel.bookings.isEmpty {
                    VStack {
                        Image(systemName: "tray.fill")
                            .resizable()
                            .scaledToFit()
                            .frame(width: 100, height: 100)
                            .foregroundColor(.gray)
                            .padding(.top, 50)
                        Text("No bookings found")
                            .font(.headline)
                            .foregroundColor(.gray)
                            .padding(.top, 20)
                        Text("You don't have any bookings yet.")
                            .font(.subheadline)
                            .foregroundColor(.gray)
                    }
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
                    .background(Color.white)
                    .cornerRadius(10)
                    .padding(.top, 50)
                } else {
                    List(viewModel.bookings) { booking in
                        NavigationLink(destination: BookingDetailView(booking: booking)) {
                            VStack(alignment: .leading, spacing: 5) {
                                Text(booking.parkingName)
                                    .font(.headline)
                                    .foregroundColor(.black)
                                
                                Text("Start: \(booking.formattedStartTime)")
                                    .font(.subheadline)
                                    .foregroundColor(.gray)
                                
                                Text("End: \(booking.formattedEndTime)")
                                    .font(.subheadline)
                                    .foregroundColor(.gray)
                            }
                            .padding(.vertical, 10)
                            .padding(.horizontal)
                            .background(Color.white)
                            .cornerRadius(8)
                        }
                        .buttonStyle(PlainButtonStyle())
                        .listRowBackground(Color.clear)
                    }
                    .listStyle(PlainListStyle())
                    .padding(.top, 10)
                }
            }
            .background(Color.white)
            .refreshable {
                await viewModel.fetchBookings()
            }
            .navigationTitle("Bookings")
            .navigationBarTitleDisplayMode(.inline)
            .onAppear {
                Task {
                    await viewModel.fetchBookings()
                }
            }
        }
    }
}

#Preview {
    BookingListView()
}
