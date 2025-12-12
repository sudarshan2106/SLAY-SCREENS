package com.slayscreens.util;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import java.io.*;
import java.lang.reflect.Type;
import java.nio.file.*;
import java.util.*;
import java.util.concurrent.locks.ReadWriteLock;
import java.util.concurrent.locks.ReentrantReadWriteLock;

/**
 * DataStore - Persistent JSON file-based storage
 * Thread-safe data persistence for GoTrip application
 */
public class DataStore {

    private static final String DATA_DIR = "data";
    private static final Gson gson = new GsonBuilder().setPrettyPrinting().create();
    private static final Map<String, ReadWriteLock> locks = new HashMap<>();

    static {
        // Initialize data directory
        try {
            Path dataPath = Paths.get(DATA_DIR);
            if (!Files.exists(dataPath)) {
                Files.createDirectories(dataPath);
                System.out.println("Created data directory: " + dataPath.toAbsolutePath());
            }
        } catch (IOException e) {
            System.err.println("Failed to create data directory: " + e.getMessage());
        }
    }

    /**
     * Get lock for specific file
     */
    private static ReadWriteLock getLock(String filename) {
        synchronized (locks) {
            return locks.computeIfAbsent(filename, k -> new ReentrantReadWriteLock());
        }
    }

    /**
     * Read data from JSON file
     */
    public static <T> List<T> readList(String filename, Type typeToken) {
        ReadWriteLock lock = getLock(filename);
        lock.readLock().lock();

        try {
            Path filePath = Paths.get(DATA_DIR, filename);

            if (!Files.exists(filePath)) {
                return new ArrayList<>();
            }

            String json = new String(Files.readAllBytes(filePath));
            List<T> data = gson.fromJson(json, typeToken);
            return data != null ? data : new ArrayList<>();

        } catch (IOException e) {
            System.err.println("Error reading " + filename + ": " + e.getMessage());
            return new ArrayList<>();
        } finally {
            lock.readLock().unlock();
        }
    }

    /**
     * Write data to JSON file
     */
    public static <T> boolean writeList(String filename, List<T> data) {
        ReadWriteLock lock = getLock(filename);
        lock.writeLock().lock();

        try {
            Path filePath = Paths.get(DATA_DIR, filename);
            String json = gson.toJson(data);
            Files.write(filePath, json.getBytes(), StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING);
            System.out.println("Saved " + data.size() + " items to " + filename);
            return true;

        } catch (IOException e) {
            System.err.println("Error writing " + filename + ": " + e.getMessage());
            return false;
        } finally {
            lock.writeLock().unlock();
        }
    }

    /**
     * Read single object from JSON file
     */
    public static <T> T readObject(String filename, Class<T> clazz) {
        ReadWriteLock lock = getLock(filename);
        lock.readLock().lock();

        try {
            Path filePath = Paths.get(DATA_DIR, filename);

            if (!Files.exists(filePath)) {
                return null;
            }

            String json = new String(Files.readAllBytes(filePath));
            return gson.fromJson(json, clazz);

        } catch (IOException e) {
            System.err.println("Error reading " + filename + ": " + e.getMessage());
            return null;
        } finally {
            lock.readLock().unlock();
        }
    }

    /**
     * Write single object to JSON file
     */
    public static <T> boolean writeObject(String filename, T data) {
        ReadWriteLock lock = getLock(filename);
        lock.writeLock().lock();

        try {
            Path filePath = Paths.get(DATA_DIR, filename);
            String json = gson.toJson(data);
            Files.write(filePath, json.getBytes(), StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING);
            System.out.println("Saved object to " + filename);
            return true;

        } catch (IOException e) {
            System.err.println("Error writing " + filename + ": " + e.getMessage());
            return false;
        } finally {
            lock.writeLock().unlock();
        }
    }

    /**
     * Check if file exists
     */
    public static boolean exists(String filename) {
        return Files.exists(Paths.get(DATA_DIR, filename));
    }

    /**
     * Delete file
     */
    public static boolean delete(String filename) {
        try {
            return Files.deleteIfExists(Paths.get(DATA_DIR, filename));
        } catch (IOException e) {
            System.err.println("Error deleting " + filename + ": " + e.getMessage());
            return false;
        }
    }

    /**
     * Get absolute path to data directory
     */
    public static String getDataDirectory() {
        return Paths.get(DATA_DIR).toAbsolutePath().toString();
    }
}
