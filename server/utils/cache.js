// /server/utils/cache.js

import NodeCache from 'node-cache';
const cache = new NodeCache({ stdTTL: 3600 }); // Cache TTL set to 1 hour

/**
 * Retrieves data from the cache.
 *
 * @param {string} key - The cache key.
 * @returns {any} - The cached data or undefined if not found.
 */
export const getFromCache = (key) => {
  return cache.get(key);
};

/**
 * Stores data in the cache.
 *
 * @param {string} key - The cache key.
 * @param {any} value - The data to cache.
 * @param {number} [ttl] - Optional TTL for the cache entry in seconds.
 */
export const setInCache = (key, value, ttl) => {
  cache.set(key, value, ttl);
};

/**
 * Deletes data from the cache.
 *
 * @param {string} key - The cache key.
 */
export const deleteFromCache = (key) => {
  cache.del(key);
};