/**
 * Mock LLM Client
 * 
 * Simulates LLM responses for development and testing.
 * Uses pattern matching to generate realistic Jaeger search parameters.
 */

import {
    ILLMClient,
    LLMCompletionRequest,
    LLMCompletionResponse,
} from './llm.client.interface';
import { logger } from '../../utils/logger';

/**
 * Mock LLM Client for development
 * 
 * This client simulates LLM responses using rule-based pattern matching.
 * Useful for:
 * - Development without API keys
 * - Testing deterministic behavior
 * - Demos with fake data
 */
export class MockLLMClient implements ILLMClient {
    /**
     * Simulates LLM completion using pattern matching
     */
    async complete(request: LLMCompletionRequest): Promise<LLMCompletionResponse> {
        logger.info('MockLLMClient: Generating simulated response');

        // Detect request type by checking prompt content
        if (request.prompt.includes('Span Data:')) {
            // This is an explain span request
            const result = this.generateSpanExplanation(request.prompt);
            return {
                content: JSON.stringify(result),
                metadata: {
                    model: 'mock-llm-v1',
                    tokensUsed: 100,
                    provider: 'mock',
                },
            };
        } else {
            // This is a query translation request
            const query = this.extractUserQuery(request.prompt);
            const params = this.matchPatterns(query);
            return {
                content: JSON.stringify(params),
                metadata: {
                    model: 'mock-llm-v1',
                    tokensUsed: 50,
                    provider: 'mock',
                },
            };
        }
    }

    /**
     * Always returns true (mock is always configured)
     */
    isConfigured(): boolean {
        return true;
    }

    /**
     * Returns provider name
     */
    getProvider(): string {
        return 'mock';
    }

    /**
     * Extracts user query from the full prompt
     */
    private extractUserQuery(prompt: string): string {
        const match = prompt.match(/User Query: "(.+?)"/);
        return match ? match[1].toLowerCase() : prompt.toLowerCase();
    }

    /**
     * Pattern matching logic to simulate LLM understanding
     */
    private matchPatterns(query: string): object {
        const result: any = {
            service: this.extractService(query),
            operation: this.extractOperation(query),
            tags: this.extractTags(query),
            minDuration: this.extractMinDuration(query),
            maxDuration: null,
            lookback: this.extractLookback(query) || '1h',
            limit: 20,
        };

        // Clean up null/undefined values
        if (!result.operation) result.operation = null;
        if (!result.minDuration) result.minDuration = null;
        if (Object.keys(result.tags).length === 0) result.tags = {};

        return result;
    }

    /**
     * Extract service name from query
     */
    private extractService(query: string): string {
        // Look for common service patterns
        const servicePatterns = [
            /(?:in|from|for) (\w+[-]?\w*)/i,
            /(payment|user|frontend|backend|api|database|auth)[-]?(\w*)/i,
        ];

        for (const pattern of servicePatterns) {
            const match = query.match(pattern);
            if (match) {
                return match[1] + (match[2] ? `-${match[2]}` : '');
            }
        }

        return 'unknown-service';
    }

    /**
     * Extract operation name from query
     */
    private extractOperation(query: string): string | null {
        const httpMethods = ['get', 'post', 'put', 'delete', 'patch'];

        for (const method of httpMethods) {
            if (query.includes(method)) {
                return `HTTP ${method.toUpperCase()}`;
            }
        }

        if (query.includes('select') || query.includes('database') || query.includes('db')) {
            return 'Database Query';
        }

        return null;
    }

    /**
     * Extract tags from query
     */
    private extractTags(query: string): Record<string, string> {
        const tags: Record<string, string> = {};

        if (query.includes('error') || query.includes('fail') || query.includes('5xx')) {
            tags.error = 'true';
        }

        if (query.includes('database') || query.includes('db')) {
            tags['db.type'] = 'postgres';
        }

        if (query.includes('http') || query.includes('request')) {
            tags['span.kind'] = 'client';
        }

        if (query.includes('500') || query.includes('5xx')) {
            tags['http.status_code'] = '500';
        }

        if (query.includes('404')) {
            tags['http.status_code'] = '404';
        }

        return tags;
    }

    /**
     * Extract minimum duration from query
     */
    private extractMinDuration(query: string): string | null {
        if (query.includes('slow') || query.includes('long')) {
            return '500ms';
        }

        // Look for explicit duration
        const durationMatch = query.match(/(\d+)\s*(ms|millisecond|second|s|minute|m)/i);
        if (durationMatch) {
            const value = durationMatch[1];
            const unit = durationMatch[2].toLowerCase();

            if (unit.startsWith('m') && !unit.startsWith('ms')) {
                return `${value}m`;
            } else if (unit.startsWith('s')) {
                return `${value}s`;
            } else {
                return `${value}ms`;
            }
        }

        return null;
    }

    /**
     * Extract lookback time from query
     */
    private extractLookback(query: string): string | null {
        const patterns: Record<string, string> = {
            'last hour': '1h',
            'past hour': '1h',
            'last 24 hours': '24h',
            'last day': '24h',
            'last week': '7d',
            'past week': '7d',
        };

        for (const [phrase, duration] of Object.entries(patterns)) {
            if (query.includes(phrase)) {
                return duration;
            }
        }

        // Look for explicit time
        const timeMatch = query.match(/(\d+)\s*(hour|h|day|d|week)/i);
        if (timeMatch) {
            const value = timeMatch[1];
            const unit = timeMatch[2].toLowerCase();

            if (unit.startsWith('w')) {
                return `${parseInt(value) * 7}d`;
            } else if (unit.startsWith('d')) {
                return `${value}d`;
            } else {
                return `${value}h`;
            }
        }

        return null;
    }

    /**
     * Generate mock span explanation
     * Simulates analyzing a span and creating an explanation
     */
    private generateSpanExplanation(prompt: string): object {
        // Extract span data from prompt
        const spanDataMatch = prompt.match(/Span Data:\s*({[\s\S]+})/);
        if (!spanDataMatch) {
            return this.getDefaultExplanation();
        }

        try {
            const spanData = JSON.parse(spanDataMatch[1]);
            return this.analyzeSpan(spanData);
        } catch (error) {
            return this.getDefaultExplanation();
        }
    }

    /**
     * Analyze span data and generate explanation
     */
    private analyzeSpan(span: any): object {
        const duration = span.duration || 0;
        const durationMs = duration / 1000; // Convert microseconds to milliseconds
        const tags = span.tags || [];

        // Determine span type
        const spanType = this.detectSpanType(span, tags);

        // Assess performance
        const assessment = this.assessPerformance(spanType, durationMs);

        // Check for errors
        const errorInfo = this.extractErrorInfo(tags, span.logs);

        // Extract key details
        const keyDetails = this.extractKeyDetails(tags, span);

        // Generate summary
        const summary = this.generateSummary(span, spanType, errorInfo);

        return {
            summary,
            spanType,
            performance: {
                duration: this.formatDurationMs(durationMs),
                assessment,
            },
            errorInfo,
            keyDetails,
        };
    }

    /**
     * Detect the type of span
     */
    private detectSpanType(span: any, tags: any[]): string {
        const httpMethod = tags.find(t => t.key === 'http.method');
        const dbType = tags.find(t => t.key === 'db.type' || t.key === 'db.statement');
        const rpcService = tags.find(t => t.key === 'rpc.service');
        const spanKind = tags.find(t => t.key === 'span.kind');

        if (httpMethod) {
            return spanKind?.value === 'server' ? 'HTTP Server' : 'HTTP Client';
        }
        if (dbType) {
            return 'Database Query';
        }
        if (rpcService || span.operationName?.toLowerCase().includes('grpc')) {
            return 'gRPC Call';
        }

        return span.operationName || 'Unknown Operation';
    }

    /**
     * Assess performance based on span type and duration
     */
    private assessPerformance(spanType: string, durationMs: number): string {
        let thresholds = { fast: 100, normal: 500, slow: 2000 };

        if (spanType.includes('Database')) {
            thresholds = { fast: 50, normal: 200, slow: 1000 };
        } else if (spanType.includes('RPC') || spanType.includes('gRPC')) {
            thresholds = { fast: 50, normal: 300, slow: 1000 };
        }

        if (durationMs < thresholds.fast) return 'fast';
        if (durationMs < thresholds.normal) return 'normal';
        if (durationMs < thresholds.slow) return 'slow';
        return 'critical';
    }

    /**
     * Extract error information from tags and logs
     */
    private extractErrorInfo(tags: any[], logs?: any[]): any {
        const errorTag = tags.find(t => t.key === 'error');
        const statusCode = tags.find(t => t.key === 'http.status_code');

        const hasError = errorTag?.value === true ||
            errorTag?.value === 'true' ||
            (statusCode && parseInt(String(statusCode.value)) >= 500);

        if (!hasError) return null;

        let errorMessage = null;
        let errorType = null;

        // Try to extract error message from logs
        if (logs && logs.length > 0) {
            const errorLog = logs.find((log: any) =>
                log.fields?.some((f: any) => f.key === 'error' || f.key === 'message')
            );
            if (errorLog) {
                const msgField = errorLog.fields.find((f: any) => f.key === 'message' || f.key === 'error');
                errorMessage = msgField?.value || null;
            }
        }

        if (statusCode) {
            errorType = `HTTP ${statusCode.value}`;
        } else {
            errorType = 'Error';
        }

        return {
            hasError: true,
            errorType,
            errorMessage,
        };
    }

    /**
     * Extract key technical details from tags
     */
    private extractKeyDetails(tags: any[], span: any): string[] {
        const details: string[] = [];

        tags.forEach(tag => {
            const key = tag.key;
            const value = tag.value;

            // Include important tags
            if (key === 'http.method' || key === 'http.status_code') {
                details.push(`${key}: ${value}`);
            } else if (key === 'db.type') {
                details.push(`Database: ${value}`);
            } else if (key === 'db.statement' && String(value).length < 100) {
                details.push(`Query: ${value}`);
            } else if (key === 'span.kind') {
                details.push(`Span kind: ${value}`);
            } else if (key === 'component') {
                details.push(`Component: ${value}`);
            }
        });

        // Add service name
        if (span.serviceName) {
            details.push(`Service: ${span.serviceName}`);
        }

        return details.slice(0, 5); // Limit to 5 details
    }

    /**
     * Generate summary text
     */
    private generateSummary(span: any, spanType: string, errorInfo: any): string {
        const service = span.serviceName || 'unknown service';
        const operation = span.operationName || 'operation';
        const status = errorInfo ? 'with errors' : 'completed successfully';

        return `${spanType}: ${operation} from ${service}, ${status}`;
    }

    /**
     * Format duration in milliseconds to human-readable
     */
    private formatDurationMs(durationMs: number): string {
        if (durationMs < 1) return `${(durationMs * 1000).toFixed(2)}μs`;
        if (durationMs < 1000) return `${durationMs.toFixed(2)}ms`;
        return `${(durationMs / 1000).toFixed(2)}s`;
    }

    /**
     * Default explanation when parsing fails
     */
    private getDefaultExplanation(): object {
        return {
            summary: 'Unable to analyze span data',
            spanType: 'Unknown',
            performance: {
                duration: '0ms',
                assessment: 'normal',
            },
            errorInfo: null,
            keyDetails: [],
        };
    }
}
