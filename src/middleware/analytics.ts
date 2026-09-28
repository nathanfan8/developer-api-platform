import {Request, Response, NextFunction} from 'express';
import {redis} from '../config/redis'; 

export function analyticsMiddleware(req: Request, res: Response, next: NextFunction) {
    const startTime = process.hrtime.bigint(); 

    res.on('finish', () => {
        if (req.path.startsWith('/api/analytics') || req.path.startsWith('health')) { 
            return
         }
         
        const endTime = process.hrtime.bigint(); 
        const duration = Number(endTime - startTime) / 1e6;

        const event = {
            method: req.method,
            route: req.route ? `${req.baseUrl || ''}${req.route.path}` : req.path,           
            status_code: res.statusCode.toString(),
            duration_ms: duration.toFixed(2),
            ip_address: req.ip || req.socket.remoteAddress || 'unknown ip address',
            timestamp: new Date().toISOString(),
        }; 

        redis.xadd(
            'api_events', 
            '*',
            'method', event.method,
            'route', event.route,
            'status_code', event.status_code,
            'duration_ms', event.duration_ms,
            'ip_address', event.ip_address,
            'timestamp', event.timestamp
        ).catch((err) => {
            console.error('Failed to enqueue telemetry event to Redis:', err);   
        });
    });
    next(); 
} 

