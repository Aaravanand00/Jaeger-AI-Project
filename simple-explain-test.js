/**
 * Simple test for explain span feature
 */

const sampleSpan = {
    spanID: 'abc123',
    traceID: 'trace-456',
    operationName: 'HTTP GET /api/users',
    serviceName: 'frontend-service',
    startTime: 1675234567000000,
    duration: 45000, // 45ms
    tags: [
        { key: 'http.method', value: 'GET' },
        { key: 'http.status_code', value: 200 },
        { key: 'span.kind', value: 'client' },
    ],
};

async function test() {
    try {
        const response = await fetch('http://localhost:3000/api/explain', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ span: sampleSpan }),
        });

        const result = await response.json();
        console.log(JSON.stringify(result, null, 2));
    } catch (error) {
        console.error('Error:', error.message);
    }
}

test();
