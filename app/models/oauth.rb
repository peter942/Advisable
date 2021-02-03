# frozen_string_literal: true

class Oauth < SimpleDelegator
  extend Memoist

  memoize def identifiers
    {provider: provider, uid: uid}
  end

  memoize def identifiers_with_blob
    identifiers.merge(blob: self)
  end

  memoize def identifiers_with_blob_and_token
    identifiers_with_blob.merge(
      token: token,
      refresh_token: refresh_token,
      expires_at: Time.zone.at(expires_at)
    )
  end

  %i[first_name last_name email].each do |info|
    define_method(info) { dig(:info, info) }
  end

  %i[token refresh_token expires_at].each do |credential|
    define_method(credential) { dig(:credentials, credential) }
  end
end
