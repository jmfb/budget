using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Budget.Server.Services;

namespace Budget.Server.Configuration {
	public static class Authentication {
		public static void Configure(JwtBearerOptions options, SymmetricSecurityKey key) {
			options.TokenValidationParameters = new TokenValidationParameters {
				ValidateIssuer = true,
				ValidIssuer = AuthenticationService.Issuer,
				ValidateAudience = true,
				ValidAudience = AuthenticationService.Audience,
				ValidateIssuerSigningKey = true,
				IssuerSigningKey = key,
				ValidateLifetime = false
			};
		}
	}
}
