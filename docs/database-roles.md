# Database roles — least privilege setup

The app should never connect to Postgres as the superuser. Run this once
against your database (adjust the password before running):

```sql
-- Application role: can read/write normal tables, cannot touch audit_log
CREATE ROLE sina_app WITH LOGIN PASSWORD 'CHANGE_ME';
GRANT CONNECT ON DATABASE sina_db TO sina_app;
GRANT USAGE ON SCHEMA public TO sina_app;

GRANT SELECT, INSERT, UPDATE, DELETE ON
  "StaffUser", "Inquiry", "InquiryStatusChange", "ContentBlock"
TO sina_app;

-- Audit log is append-only from the app's perspective: it can insert new
-- rows but can never update or delete existing ones. This means even a
-- full compromise of the app's DB credentials can't be used to cover
-- tracks by editing the audit trail.
GRANT SELECT, INSERT ON "AuditLog" TO sina_app;

GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO sina_app;
```

For migrations (`prisma migrate deploy`), use a separate, more privileged
role that's only used during deploys — not the runtime app role above.

## Backups

- Enable automated daily backups at the hosting/DB provider level.
- Test the restore process at least once before launch.
- Keep at least 7-30 days of point-in-time recovery depending on provider tier.
