import com.sun.net.httpserver.HttpExchange

object BookingAPI {

    // BOOK TICKET
    fun book(exchange: HttpExchange) {

        if (exchange.requestMethod == "OPTIONS") {
            sendResponse(exchange, 204, "")
            return
        }

        val body = exchange.requestBody
            .bufferedReader()
            .readText()

        val userId = getValue(body, "userId")
        val showId = getValue(body, "showId")
        val seats = getValue(body, "seats")

        try {

            Database.getConnection().use { connection ->

                val priceQuery =
                    "SELECT ticket_price FROM shows WHERE id = ?"

                connection.prepareStatement(priceQuery).use { statement ->

                    statement.setInt(1, showId.toInt())

                    val result = statement.executeQuery()

                    if (!result.next()) {
                        sendResponse(
                            exchange,
                            404,
                            """{"message":"Show not found"}"""
                        )
                        return
                    }

                    val price = result.getDouble("ticket_price")
                    val total = price * seats.toInt()

                    val bookingCode =
                        "MMS" + (10000..99999).random()

                    val insertQuery = """
                        INSERT INTO bookings
                        (booking_code, user_id, show_id,
                         ticket_quantity, ticket_price, total_amount)
                        VALUES (?, ?, ?, ?, ?, ?)
                    """.trimIndent()

                    connection.prepareStatement(insertQuery).use { insert ->

                        insert.setString(1, bookingCode)
                        insert.setInt(2, userId.toInt())
                        insert.setInt(3, showId.toInt())
                        insert.setInt(4, seats.toInt())
                        insert.setDouble(5, price)
                        insert.setDouble(6, total)

                        insert.executeUpdate()
                    }

                    sendResponse(
                        exchange,
                        200,
                        """
                        {
                            "message":"Booking successful",
                            "bookingCode":"$bookingCode",
                            "seats":$seats
                        }
                        """.trimIndent()
                    )
                }
            }

        } catch (e: Exception) {

            println("Booking error: ${e.message}")

            sendResponse(
                exchange,
                500,
                """{"message":"Booking failed"}"""
            )
        }
    }


    // GET USER TICKETS
    fun getBookings(exchange: HttpExchange) {

        if (exchange.requestMethod == "OPTIONS") {
            sendResponse(exchange, 204, "")
            return
        }

        val userId = exchange.requestURI
            .query
            ?.substringAfter("userId=", "")
            ?: ""

        try {

            Database.getConnection().use { connection ->

                val sql = """
                    SELECT b.id,
                           b.booking_code,
                           b.ticket_quantity,
                           b.total_amount,
                           b.booking_status,
                           b.booked_at,
                           m.title AS movie_title,
                           e.title AS event_title
                    FROM bookings b
                    JOIN shows s ON b.show_id = s.id
                    LEFT JOIN movies m ON s.movie_id = m.id
                    LEFT JOIN events e ON s.event_id = e.id
                    WHERE b.user_id = ?
                    ORDER BY b.booked_at DESC
                """.trimIndent()

                connection.prepareStatement(sql).use { statement ->

                    statement.setInt(1, userId.toInt())

                    val result = statement.executeQuery()

                    val tickets = StringBuilder("[")
                    var first = true

                    while (result.next()) {

                        if (!first) {
                            tickets.append(",")
                        }

                        val movie =
                            result.getString("movie_title")

                        val event =
                            result.getString("event_title")

                        val title =
                            movie ?: event ?: "Ticket"

                        tickets.append(
                            """
                            {
                                "id":${result.getInt("id")},
                                "bookingCode":"${result.getString("booking_code")}",
                                "title":"$title",
                                "seats":${result.getInt("ticket_quantity")},
                                "total":${result.getDouble("total_amount")},
                                "status":"${result.getString("booking_status")}",
                                "date":"${result.getTimestamp("booked_at")}"
                            }
                            """.trimIndent()
                        )

                        first = false
                    }

                    tickets.append("]")

                    sendResponse(
                        exchange,
                        200,
                        tickets.toString()
                    )
                }
            }

        } catch (e: Exception) {

            println("Get bookings error: ${e.message}")

            sendResponse(
                exchange,
                500,
                """{"message":"Could not load tickets"}"""
            )
        }
    }


    // DELETE / STRIKE TICKET
    fun cancelBooking(exchange: HttpExchange) {

        if (exchange.requestMethod == "OPTIONS") {
            sendResponse(exchange, 204, "")
            return
        }

        val body = exchange.requestBody
            .bufferedReader()
            .readText()

        val bookingId = getValue(body, "bookingId")
        val userId = getValue(body, "userId")

        try {

            Database.getConnection().use { connection ->

                val sql = """
                    UPDATE bookings
                    SET booking_status = 'CANCELLED',
                        cancelled_at = CURRENT_TIMESTAMP
                    WHERE id = ? AND user_id = ?
                """.trimIndent()

                connection.prepareStatement(sql).use { statement ->

                    statement.setInt(1, bookingId.toInt())
                    statement.setInt(2, userId.toInt())

                    statement.executeUpdate()
                }

                sendResponse(
                    exchange,
                    200,
                    """{"message":"Ticket deleted"}"""
                )
            }

        } catch (e: Exception) {

            println("Cancel error: ${e.message}")

            sendResponse(
                exchange,
                500,
                """{"message":"Could not delete ticket"}"""
            )
        }
    }


    private fun getValue(
        json: String,
        key: String
    ): String {

        val start = json.indexOf("\"$key\"")

        if (start == -1) {
            return ""
        }

        val colon = json.indexOf(":", start)
        val firstQuote = json.indexOf("\"", colon)
        val secondQuote =
            json.indexOf("\"", firstQuote + 1)

        return json.substring(
            firstQuote + 1,
            secondQuote
        )
    }


    private fun sendResponse(
        exchange: HttpExchange,
        status: Int,
        response: String
    ) {

        exchange.responseHeaders.add(
            "Content-Type",
            "application/json"
        )

        exchange.responseHeaders.add(
            "Access-Control-Allow-Origin",
            "http://localhost:5173"
        )

        exchange.responseHeaders.add(
            "Access-Control-Allow-Methods",
            "GET, POST, OPTIONS"
        )

        exchange.responseHeaders.add(
            "Access-Control-Allow-Headers",
            "Content-Type"
        )

        val bytes = response.toByteArray()

        exchange.sendResponseHeaders(
            status,
            if (status == 204) -1 else bytes.size.toLong()
        )

        if (status != 204) {
            exchange.responseBody.use {
                it.write(bytes)
            }
        } else {
            exchange.responseBody.close()
        }
    }
}