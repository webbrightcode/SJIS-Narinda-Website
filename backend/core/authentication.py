from rest_framework.authentication import TokenAuthentication


class SafeTokenAuthentication(TokenAuthentication):
    """
    Resilient Token Authentication.
    If a valid token is provided, authenticates the user.
    If an invalid, expired, or malformed token is provided (e.g. from a cleared DB
    or stale localStorage in development), returns None instead of raising AuthenticationFailed.
    This allows permissive endpoints to proceed smoothly without spurious 401 errors.
    """

    def authenticate_credentials(self, key):
        model = self.get_model()
        try:
            token = model.objects.select_related('user').get(key=key)
        except Exception:
            return None

        if not token.user.is_active:
            return None

        return (token.user, token)
