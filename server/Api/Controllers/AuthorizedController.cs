using System.Linq;
using Budget.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Budget.Server.Api.Controllers;

[Authorize]
public class AuthorizedController : Controller
{
	protected string UserId =>
		User
			.Claims.Single(claim =>
				claim.Type == AuthenticationService.UserIdClaimType
			)
			.Value;
}
