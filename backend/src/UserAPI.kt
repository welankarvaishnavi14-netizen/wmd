import com.sun.net.httpserver.HttpExchange

object UserAPI {

    fun signup(exchange: HttpExchange) {

        if (exchange.requestMethod == "OPTIONS") {
            sendResponse(exchange, 204, "")
            return
        }

        val body = exchange.requestBody
            .bufferedReader()
            .readText()

        println("Signup data: $body")

        val username = getValue(body, "username")
        val email = getValue(body, "email")
        val contact = getValue(body, "contact")
        val gender = getValue(body, "gender")
        val password = getValue(body, "password")

        val sql = """
            INSERT INTO users
            (username, email, contact, gender, password_hash, role)
            VALUES (?, ?, ?, ?, ?, 'user')
        """.trimIndent()

        try {

            Database.getConnection().use { connection ->

                connection.prepareStatement(sql).use { statement ->

                    statement.setString(1, username)
                    statement.setString(2, email)
                    statement.setString(3, contact)
                    statement.setString(4, gender)
                    statement.setString(5, password)

                    statement.executeUpdate()
                }
            }

            sendResponse(
                exchange,
                201,
                """{"status":"success","message":"Signup successful"}"""
            )

        } catch (e: Exception) {

            println("Error: ${e.message}")

            sendResponse(
                exchange,
                500,
                """{"status":"error","message":"Signup failed"}"""
            )
        }
    }


    fun login(exchange: HttpExchange) {

        if (exchange.requestMethod == "OPTIONS") {
            sendResponse(exchange, 204, "")
            return
        }

        val body = exchange.requestBody
            .bufferedReader()
            .readText()

        println("Login data: $body")

        val email = getValue(body, "email")
        val password = getValue(body, "password")

        val sql = """
            SELECT id, username, email, contact, gender
            FROM users
            WHERE email = ? AND password_hash = ?
        """.trimIndent()

        try {

            Database.getConnection().use { connection ->

                connection.prepareStatement(sql).use { statement ->

                    statement.setString(1, email)
                    statement.setString(2, password)

                    val result = statement.executeQuery()

                    if (result.next()) {

                        val id = result.getInt("id")
                        val username = result.getString("username")
                        val contact = result.getString("contact")
                        val gender = result.getString("gender")

                        sendResponse(
                            exchange,
                            200,
                            """
                            {
                                "status":"success",
                                "id":$id,
                                "username":"$username",
                                "email":"$email",
                                "contact":"$contact",
                                "gender":"$gender"
                            }
                            """.trimIndent()
                        )

                    } else {

                        sendResponse(
                            exchange,
                            401,
                            """{"status":"error","message":"Invalid email or password"}"""
                        )
                    }
                }
            }

        } catch (e: Exception) {

            println("Error: ${e.message}")

            sendResponse(
                exchange,
                500,
                """{"status":"error","message":"Login failed"}"""
            )
        }
    }


    fun getValue(json: String, key: String): String {

        val start = json.indexOf("\"$key\"")

        if (start == -1) {
            return ""
        }

        val colon = json.indexOf(":", start)
        val firstQuote = json.indexOf("\"", colon)
        val secondQuote = json.indexOf("\"", firstQuote + 1)

        return json.substring(
            firstQuote + 1,
            secondQuote
        )
    }


    fun sendResponse(
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
            "POST, OPTIONS"
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