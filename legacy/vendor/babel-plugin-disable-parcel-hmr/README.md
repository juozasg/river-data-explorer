disable-parcel-hmr
---
Updated to insert a code stub (instead of comment) to workaound HMR problems for Parcel for LitElement.

This makes it so all non-WebComponent code reloads without HMR. WC code is not affected and has to be reloaded manually. A better solution must exist