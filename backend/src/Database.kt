
import java.sql.Connection
import java.sql.DriverManager

object Database {

    private const val URL =
        "jdbc:mysql://localhost:3306/makemyshow"

    private const val USER = "root"

    private const val PASSWORD = "########"

    fun getConnection(): Connection {
        return DriverManager.getConnection(
            URL,
            USER,
            PASSWORD
        )
    }
}
