/**
 * Test Explain Span Feature
 * 
 * Tests the span explanation feature with sample span data.
 */

// Sample HTTP span
const httpSpan = {
    spanID: 'abc123',
    traceID: 'trace-456',
    operationName: 'HTTP GET /api/users',
    serviceName: 'frontend-service',
    startTime: 1675234567000000,
    duration: 45000, // 45ms in microseconds
    tags: [
        { key: 'http.method', value: 'GET' },
        { key: 'http.status_code', value: 200 },
        { key: 'http.url', value: '/api/users' },
        { key: 'span.kind', value: 'client' },
    ],
};

// Sample database span (slow)
const dbSpan = {
    spanID: 'db-789',
    traceID: 'trace-456',
    operationName: 'SELECT * FROM users WHERE id = ?',
    serviceName: 'user-service',
    startTime: 1675234567100000,
    duration: 850000, // 850ms in microseconds (slow!)
    tags: [
        { key: 'db.type', value: 'postgres' },
        { key: 'db.statement', value: 'SELECT * FROM users WHERE id = $1' },
        { key: 'db.user', value: 'app_user' },
        { key: 'span.kind', value: 'client' },
    ],
};

// Sample error span
const errorSpan = {
    spanID: 'err-999',
    traceID: 'trace-789',
    operationName: 'HTTP POST /api/payment',
    serviceName: 'payment-service',
    startTime: 1675234567200000,
    duration: 125000, // 125ms
    tags: [
        { key: 'http.method', value: 'POST' },
        { key: 'http.status_code', value: 500 },
        { key: 'error', value: true },
        { key: 'span.kind', value: 'server' },
    ],
    logs: [
        {
            timestamp: 1675234567250000,
            fields: [
                { key: 'event', value: 'error' },
                { key: 'message', value: 'Database connection timeout' },
            ],
        },
    ],
};

const testSpans = [
    { name: 'HTTP GET Request (Normal)', span: httpSpan },
    { name: 'Database Query (Slow)', span: dbSpan },
    { name: 'HTTP POST with Error', span: errorSpan },
];

async function testExplain(name, span) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Test: ${name}`);
    console.log('='.repeat(60));

    try {
        const response = await fetch('http://localhost:3000/api/explain', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ span }),
        });

        const result = await response.json();

        if (result.success) {
            console.log('\n✅ Explanation generated:\n');
            console.log('Summary:', result.data.explanation.summary);
            console.log('Span Type:', result.data.explanation.spanType);
            console.log('Performance:', result.data.explanation.performance);
            console.log('Error Info:', result.data.explanation.errorInfo);
            console.log('Key Details:', result.data.explanation.keyDetails);
            console.log('\nMetadata:', result.data.metadata);
        } else {
            console.log('\n❌ Error:', result.error);
        }
    } catch (error) {
        console.error('❌ Request failed:', error.message);
    }
}

async function runTests() {
    console.log('🚀 Testing Span Explanation Feature\n');
    console.log('Make sure the server is running on http://localhost:3000\n');

    for (const { name, span } of testSpans) {
        await testExplain(name, span);
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ All tests completed!');
    console.log('='.repeat(60) + '\n');
}

runTests().catch(console.error);
