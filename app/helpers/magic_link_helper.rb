module MagicLinkHelper
  def magic_link(account, url, expires_at: nil, uses: nil)
    ml = MagicLink.create(
      path: url,
      account: account,
      expires_at: expires_at,
      uses_remaining: uses
    )

    uri = URI.parse(url)
    uri.query = [uri.query, "mlt=#{ml.token}", "mluid=#{account.uid}"].compact.join('&')
    uri.to_s
  end
end
