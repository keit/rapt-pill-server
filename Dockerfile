# Use the official InfluxDB image as the base
FROM influxdb:2.7.10

# Set environment variables for Node.js version
ENV NODE_VERSION=18.18.0

# Install Node.js
RUN apt-get update && apt-get install -y \
    curl \
    && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Verify Node.js installation
RUN node -v && npm -v

# Expose InfluxDB port
EXPOSE 8086

# Set InfluxDB entry point
ENTRYPOINT ["/entrypoint.sh"]

# Default command (can be overridden when running the container)
CMD ["influxd"]
