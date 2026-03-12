# Tustain Carriers

A website for the Tustain Carriers yard sale event, raising funds for **Katherine House Hospice**.

## About

This is a static website built with HTML, CSS, and JavaScript. It features an intro overlay, event details, and information about the charity fundraiser.

## Files

- `index.html` – Main page
- `404.html` – Custom 404 error page
- `styles.css` – Stylesheet
- `script.js` – JavaScript functionality

## 404 Error Page

A custom 404 error page is included (`404.html`) that matches the site's design. To enable it, you'll need to configure your web server:

### Apache (.htaccess)

Create or edit a `.htaccess` file in the root directory:

```apache
ErrorDocument 404 /404.html
```

### Nginx

Add this to your server block configuration:

```nginx
error_page 404 /404.html;
location = /404.html {
    internal;
}
```

### GitHub Pages

GitHub Pages automatically serves `404.html` for missing pages — no configuration needed!

### Netlify

Netlify automatically serves `404.html` for missing pages — no configuration needed!

### Vercel

Create a `vercel.json` file in the root directory:

```json
{
  "routes": [
    {
      "handle": "filesystem"
    },
    {
      "src": "/(.*)",
      "status": 404,
      "dest": "/404.html"
    }
  ]
}
```

### Amazon S3

For S3 static website hosting, you'll need to configure two buckets:

#### Main Bucket (tc-yardsale.co.uk)

1. **Enable Static Website Hosting**:
   - Go to bucket Properties → Static website hosting
   - Enable static website hosting
   - Index document: `index.html`
   - Error document: `404.html`

2. **Apply Bucket Policy**:
   - Go to bucket Permissions → Bucket policy
   - Paste this policy (replace `tc-yardsale.co.uk` if needed):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::tc-yardsale.co.uk/*"
    }
  ]
}
```

3. **Disable Block Public Access**:
   - Go to Permissions → Block public access
   - Uncheck "Block all public access"
   - Confirm the changes

#### Redirect Bucket (www.tc-yardsale.co.uk)

1. **Enable Static Website Hosting**:
   - Go to bucket Properties → Static website hosting
   - Select "Redirect requests for an object"
   - Host name: `tc-yardsale.co.uk`
   - Protocol: `http` or `https` (depending on your setup)

2. **No bucket policy needed** for the redirect bucket

#### DNS Configuration

Point your domain DNS records to S3:
- **A record** (or ALIAS): `tc-yardsale.co.uk` → S3 website endpoint
- **CNAME**: `www.tc-yardsale.co.uk` → `www.tc-yardsale.co.uk.s3-website-[region].amazonaws.com`

Or use CloudFront for HTTPS support.

### Local Testing

To test the 404 page locally, simply open `404.html` directly in your browser. The "Return Home" button should navigate back to `index.html`.

## Charity

All proceeds from the yard sale go to [Katherine House Hospice](https://www.katherinehouse.org.uk/).
