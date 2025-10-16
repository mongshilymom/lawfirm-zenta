# 🆘 Support Guide

## How to Get Help

### 1. Check Documentation First
- Read `README_BUYER.md` thoroughly
- Review inline code comments
- Check component documentation

### 2. Search Official Resources
- **Next.js**: https://nextjs.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Supabase**: https://supabase.com/docs
- **TypeScript**: https://www.typescriptlang.org/docs

### 3. Email Support
**Email**: support@youalta.net

**Response Time**: Within 48 hours (business days)

**What to Include**:
- Detailed description of the issue
- Steps to reproduce
- Screenshots or error messages
- Your environment (OS, Node version, browser)
- What you've already tried

---

## What's Covered

### ✅ Included in Support:
- ZENTA setup and installation help
- Bug fixes for core ZENTA features
- Guidance on basic customization
- Deployment assistance
- Database schema questions
- Configuration help

### ❌ Not Included:
- Custom feature development
- Design modifications beyond documented options
- Content creation or copywriting
- Third-party service configuration (beyond what's documented)
- General web development tutoring
- Hosting/server management
- Code review for your custom additions

---

## Common Issues & Solutions

### Issue: Build Fails
**Solution**:
```bash
# Clear cache and reinstall
rm -rf .next node_modules
npm install
npm run build
```

### Issue: Database Connection Error
**Solutions**:
1. Verify `.env` credentials are correct
2. Check Supabase project is active (not paused)
3. Ensure you ran `schema.sql` in Supabase SQL Editor
4. Verify RLS policies are set up

### Issue: Styling Not Applying
**Solutions**:
1. Restart dev server: `npm run dev`
2. Clear browser cache
3. Check Tailwind classes are spelled correctly
4. Run: `npx tailwindcss -i ./app/globals.css -o ./public/output.css`

### Issue: Contact Form Not Working
**Solutions**:
1. Replace `REPLACE_WITH_YOUR_FORMSPREE_ID` with actual Formspree ID
2. Test form submission in production (some features don't work in dev)
3. Check browser console for errors
4. Verify form action URL is correct

### Issue: Images Not Loading
**Solutions**:
1. Check images are in `/public` folder
2. Use correct paths: `/image.jpg` not `./image.jpg`
3. Verify image formats are supported (jpg, png, webp, svg)
4. Check Next.js Image component configuration

---

## Before Contacting Support

Please try these steps first:

1. ✅ Read this support guide
2. ✅ Check `README_BUYER.md`
3. ✅ Search official documentation
4. ✅ Clear caches and restart dev server
5. ✅ Try in a fresh browser/incognito mode
6. ✅ Check browser console for errors

---

## Helpful Information to Provide

When contacting support, include:

### Environment
- Operating System: (e.g., macOS 14.0, Windows 11)
- Node.js version: (run `node -v`)
- Package manager: (npm, pnpm, or yarn)
- Browser: (Chrome, Firefox, Safari + version)

### Error Details
- Full error message
- Screenshots of the issue
- Console errors (press F12 → Console tab)
- Network errors (F12 → Network tab)

### What You've Tried
- Steps you've already attempted
- Any error messages you encountered
- Changes you made to the code

---

## Support Period

- **Duration**: 12 months from purchase date
- **Type**: Email support
- **Response Time**: Within 48 business hours
- **Coverage**: ZENTA bugs and setup assistance

After support period expires:
- ZENTA continues to work
- Documentation remains accessible
- Extended support available for purchase

---

## Self-Service Resources

### Video Tutorials (Coming Soon)
- Initial setup walkthrough
- Customization guide
- Deployment tutorial
- Database configuration

### Community
- GitHub Discussions: [Link to be provided]
- Discord Community: [Link to be provided]

---

## Reporting Bugs

If you find a bug in ZENTA:

1. Email: support@youalta.net
2. Subject: "Bug Report: [Brief Description]"
3. Include:
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Screenshots
   - Your environment details

---

Thank you for using Zenta! We're here to help. 🙏
