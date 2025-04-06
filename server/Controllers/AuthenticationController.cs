using System.Linq;
using System.Threading.Tasks;
using Budget.Server.Contracts.DataContracts;
using Budget.Server.Services;
using Microsoft.AspNetCore.Mvc;

namespace Budget.Server.Controllers;

[Route("authentication")]
public class AuthenticationController(
	IAuthenticationService authenticationService
) : Controller
{
	private static string[] AuthorizedEmails { get; } =
		{ "jacob.buysse@gmail.com", "sarah.beth.zierke@gmail.com" };

	[HttpGet("url")]
	public async Task<string> GetAuthenticationUrl(
		[FromQuery] string redirectUrl
	)
	{
		return await authenticationService.GetGoogleAuthenticationUrlAsync(
			redirectUrl
		);
	}

	[HttpGet("sign-in")]
	public async Task<IActionResult> SignIn(
		[FromQuery] string redirectUrl,
		[FromQuery] string authorizationCode
	)
	{
		var googleToken = await authenticationService.GetGoogleTokenAsync(
			redirectUrl,
			authorizationCode
		);
		var userInfo = await authenticationService.GetUserInfoAsync(
			googleToken.TokenType,
			googleToken.AccessToken
		);
		var email = userInfo.Email.ToLower();
		if (!AuthorizedEmails.Contains(email))
			return Unauthorized();
		var response = new SignedInModel
		{
			AccessToken = authenticationService.CreateAccessToken(email),
			Email = email,
		};
		return Ok(response);
	}
}
