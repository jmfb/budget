using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Budget.Server.Api.Models;
using Budget.Server.Services;

namespace Budget.Server.Api.Controllers {
	[Route("api/authentication")]
	public class AuthenticationController : Controller {
		private IAuthenticationService AuthenticationService { get; }
		private static string[] AuthorizedEmails { get; } = {
			"jacob.buysse@gmail.com"
			// TODO: Add Sarah once she makes an account
		};

		public AuthenticationController(IAuthenticationService authenticationService) {
			AuthenticationService = authenticationService;
		}

		[HttpGet("url")]
		public async Task<string> GetAuthenticationUrlAsync(string redirectUrl) {
			return await AuthenticationService.GetGoogleAuthenticationUrlAsync(redirectUrl);
		}

		[HttpGet("sign-in")]
		public async Task<IActionResult> SignInAsync(string redirectUrl, string authorizationCode) {
			var googleToken = await AuthenticationService.GetGoogleTokenAsync(redirectUrl, authorizationCode);
			var userInfo = await AuthenticationService.GetUserInfoAsync(googleToken.TokenType, googleToken.AccessToken);
			var email = userInfo.Email.ToLower();
			if (!AuthorizedEmails.Contains(email)) {
				return Unauthorized();
			}
			return Ok(new SignedInModel {
				AccessToken = AuthenticationService.CreateAccessToken(email),
				Email = email
			});
		}
	}
}
