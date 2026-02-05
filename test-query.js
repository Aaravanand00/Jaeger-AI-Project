#!/usr/bin/env node
/**
 * Test Script for Query Translation
 * 
 * Tests the natural language → Jaeger search feature with sample queries.
 */

const queries = [
    'show me slow requests in payment service',
    'errors in user-api from the last hour',
    'database calls taking more than 500ms',
    'GET requests to frontend that failed',
    'POST requests in auth-service from the last 24 hours',
];

async function testQuery(query) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Query: "${query}"`);
    console.log('='.repeat(60));

    try {
        const response = await fetch('http://localhost:3000/api/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query }),
        });

        const result = await response.json();

        if (result.success) {
            console.log('\n✅ Translation successful:\n');
            console.log(JSON.stringify(result.data.params, null, 2));
            console.log(`\nMetadata:`, result.data.metadata);
        } else {
            console.log('\n❌ Error:', result.error);
        }
    } catch (error) {
        console.error('❌ Request failed:', error.message);
    }
}

async function runTests() {
    console.log('🚀 Testing Natural Language → Jaeger Search Translation\n');
    console.log('Make sure the server is running on http://localhost:3000\n');

    for (const query of queries) {
        await testQuery(query);
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ All tests completed!');
    console.log('='.repeat(60) + '\n');
}

runTests().catch(console.error);
