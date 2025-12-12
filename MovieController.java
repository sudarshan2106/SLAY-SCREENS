package com.slayscreens.controller;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.slayscreens.model.Movie;
import com.slayscreens.util.DataStore;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;

@WebServlet("/api/movies")
public class MovieController extends HttpServlet {

    private static final String MOVIES_FILE = "movies.json";
    private static final Gson gson = new Gson();
    private static final Type MOVIE_LIST_TYPE = new TypeToken<List<Movie>>() {
    }.getType();

    @Override
    public void init() throws ServletException {
        // Initialize with default data if file doesn't exist
        if (!DataStore.exists(MOVIES_FILE)) {
            System.out.println("Initializing movies database with default data...");
            List<Movie> defaultMovies = getDefaultMovies();
            DataStore.writeList(MOVIES_FILE, defaultMovies);
            System.out.println("Initialized " + defaultMovies.size() + " movies");
        }
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.setHeader("Access-Control-Allow-Origin", "*");

        try {
            List<Movie> movies = DataStore.readList(MOVIES_FILE, MOVIE_LIST_TYPE);
            String json = gson.toJson(movies);
            response.getWriter().write(json);
            System.out.println("Returned " + movies.size() + " movies");

        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("{\"error\": \"" + e.getMessage() + "\"}");
            e.printStackTrace();
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.setHeader("Access-Control-Allow-Origin", "*");

        try {
            // Read request body
            BufferedReader reader = request.getReader();
            Movie newMovie = gson.fromJson(reader, Movie.class);

            // Generate ID
            newMovie.setId(System.currentTimeMillis());

            // Read existing movies
            List<Movie> movies = DataStore.readList(MOVIES_FILE, MOVIE_LIST_TYPE);

            // Add new movie at the beginning
            movies.add(0, newMovie);

            // Save to file
            DataStore.writeList(MOVIES_FILE, movies);

            // Return the created movie
            response.setStatus(HttpServletResponse.SC_CREATED);
            response.getWriter().write(gson.toJson(newMovie));
            System.out.println("Added new movie: " + newMovie.getTitle());

        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("{\"error\": \"" + e.getMessage() + "\"}");
            e.printStackTrace();
        }
    }

    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.setHeader("Access-Control-Allow-Origin", "*");

        try {
            // Read request body
            BufferedReader reader = request.getReader();
            Movie updatedMovie = gson.fromJson(reader, Movie.class);

            // Read existing movies
            List<Movie> movies = DataStore.readList(MOVIES_FILE, MOVIE_LIST_TYPE);

            // Find and update movie
            boolean found = false;
            for (int i = 0; i < movies.size(); i++) {
                if (movies.get(i).getId() == updatedMovie.getId()) {
                    movies.set(i, updatedMovie);
                    found = true;
                    break;
                }
            }

            if (found) {
                DataStore.writeList(MOVIES_FILE, movies);
                response.getWriter().write(gson.toJson(updatedMovie));
                System.out.println("Updated movie: " + updatedMovie.getTitle());
            } else {
                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                response.getWriter().write("{\"error\": \"Movie not found\"}");
            }

        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("{\"error\": \"" + e.getMessage() + "\"}");
            e.printStackTrace();
        }
    }

    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.setHeader("Access-Control-Allow-Origin", "*");

        try {
            // Get movie ID from path
            String pathInfo = request.getPathInfo();
            if (pathInfo == null || pathInfo.length() <= 1) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                response.getWriter().write("{\"error\": \"Movie ID required\"}");
                return;
            }

            long movieId = Long.parseLong(pathInfo.substring(1));

            // Read existing movies
            List<Movie> movies = DataStore.readList(MOVIES_FILE, MOVIE_LIST_TYPE);

            // Remove movie
            boolean removed = movies.removeIf(m -> m.getId() == movieId);

            if (removed) {
                DataStore.writeList(MOVIES_FILE, movies);
                response.getWriter().write("{\"success\": true}");
                System.out.println("Deleted movie ID: " + movieId);
            } else {
                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                response.getWriter().write("{\"error\": \"Movie not found\"}");
            }

        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("{\"error\": \"" + e.getMessage() + "\"}");
            e.printStackTrace();
        }
    }

    @Override
    protected void doOptions(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
        response.setStatus(HttpServletResponse.SC_OK);
    }

    // Default movies data (same as frontend db.js)
    private List<Movie> getDefaultMovies() {
        List<Movie> movies = new ArrayList<>();

        movies.add(new Movie(1, "Venom: The Last Dance", "Action/Sci-Fi", "2h 15m", 8.5, "Kelly Marcel",
                "https://image.tmdb.org/t/p/w500/8UlWHLMpgZm9bx6QYh0NFoq67TZ.jpg",
                "https://image.tmdb.org/t/p/original/3V4kLQg0kSqPLctI5ziYWabAZYF.jpg",
                "Eddie and Venom are on the run. Hunted by both of their worlds.", 250, "Active"));

        movies.add(new Movie(2, "The Wild Robot", "Animation", "1h 45m", 9.0, "Chris Sanders",
                "https://image.tmdb.org/t/p/w500/aosm8NMQ3UyoBVpSxyimorCQykC.jpg",
                "https://image.tmdb.org/t/p/original/v9acaJ6863OHOpOVQuLAduGo3sp.jpg",
                "A robot washed ashore on an uninhabited island must learn to adapt.", 200, "Active"));

        movies.add(new Movie(3, "Joker: Folie à Deux", "Drama/Thriller", "2h 18m", 7.8, "Todd Phillips",
                "https://image.tmdb.org/t/p/w500/wTnV3PCVW5O92JMrFvvrRcV39RU.jpg",
                "https://image.tmdb.org/t/p/original/u3YQJctMzFN2wVonHCLE7XfS06p.jpg",
                "Arthur Fleck is institutionalized at Arkham awaiting trial.", 300, "Active"));

        // Add more movies as needed...

        return movies;
    }
}
