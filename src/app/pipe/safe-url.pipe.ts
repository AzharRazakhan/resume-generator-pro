import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Pipe({
    name: 'safeUrl',
    standalone: true // 👈 CRITICAL: Must be standalone
})
export class SafeUrlPipe implements PipeTransform {
    constructor(private sanitizer: DomSanitizer) { }

    transform(url: string): SafeResourceUrl {
        // This bypasses security checks, allowing the Base64 data URI to load in the iframe
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
}