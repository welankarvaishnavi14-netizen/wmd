import com.sun.net.httpserver.HttpServer
import java.net.InetSocketAddress

fun main() {

    val server = HttpServer.create(
        InetSocketAddress(8080), 0
    )

    server.createContext("/api/signup") {
        UserAPI.signup(it)
    }

    server.createContext("/api/login") {
        UserAPI.login(it)
    }

    server.createContext("/api/book") {
        BookingAPI.book(it)
    }

    server.createContext("/api/bookings") {
        BookingAPI.getBookings(it)
    }

    server.createContext("/api/cancel") {
        BookingAPI.cancelBooking(it)
    }

    server.start()

    println("MakeMyShow backend running on port 8080")
}