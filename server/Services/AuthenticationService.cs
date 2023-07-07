using System;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using System.Web;
using Microsoft.Extensions.Options;
using Budget.Server.Models;
using Microsoft.IdentityModel.Tokens;

namespace Budget.Server.Services;

public interface IAuthenticationService {
	Task<string> GetGoogleAuthenticationUrlAsync(string redirectUrl);
	Task<TokenModel> GetGoogleTokenAsync(string redirectUrl, string authorizationCode);
	Task<UserInfoModel> GetUserInfoAsync(string tokenType, string accessToken);
	string CreateAccessToken(string email);
}

public class AuthenticationService : IAuthenticationService {
	private const string clientId = "959516251255-9mv1krbshllravj1u11op9a14ont56gu.apps.googleusercontent.com";
	public const string Audience = "https://budget.buysse.link";
	public const string Issuer = "https://budget.buysse.link";
	private const string signatureAlgorithm = "http://www.w3.org/2001/04/xmldsig-more#hmac-sha256";
	private const string digestAlgorithm = "http://www.w3.org/2001/04/xmlenc#sha256";
	public const string UserIdClaimType = "userId";

	private HttpClient HttpClient { get; }
	private SymmetricSecurityKey Key { get; }
	private string ClientSecret { get; }

	public AuthenticationService(
		HttpClient httpClient,
		IOptions<AppSettings> appSettingsAccessor
	) {
		HttpClient = httpClient;
		var appSettings = appSettingsAccessor.Value;
		Key = appSettings.Key;
		ClientSecret = appSettings.BudgetAuthClientSecret;
	}

	private async Task<DiscoveryModel> GetDiscoveryModelAsync() {
		var response = await HttpClient.GetAsync("https://accounts.google.com/.well-known/openid-configuration");
		if (!response.IsSuccessStatusCode)
			throw new InvalidOperationException(await response.Content.ReadAsStringAsync());
		var json = await response.Content.ReadAsStringAsync();
		return JsonSerializer.Deserialize<DiscoveryModel>(json);
	}

	public async Task<string> GetGoogleAuthenticationUrlAsync(string redirectUrl) {
		var query = HttpUtility.ParseQueryString("");
		query["redirect_uri"] = redirectUrl;
		query["prompt"] = "consent";
		query["response_type"] = "code";
		query["client_id"] = clientId;
		query["scope"] = "https://www.googleapis.com/auth/userinfo.email";
		query["access_type"] = "offline";
		var discovery = await GetDiscoveryModelAsync();
		return $"{discovery.AuthorizationEndpoint}?{query}";
	}

	public async Task<TokenModel> GetGoogleTokenAsync(string redirectUrl, string authorizationCode) {
		var discovery = await GetDiscoveryModelAsync();
		var query = HttpUtility.ParseQueryString("");
		query["code"] = authorizationCode;
		query["redirect_uri"] = redirectUrl;
		query["client_id"] = clientId;
		query["client_secret"] = ClientSecret;
		query["scope"] = "";
		query["grant_type"] = "authorization_code";
		var content = new StringContent(query.ToString(), Encoding.UTF8, "application/x-www-form-urlencoded");
		var response = await HttpClient.PostAsync(discovery.TokenEndpoint, content);
		if (!response.IsSuccessStatusCode)
			throw new InvalidOperationException(await response.Content.ReadAsStringAsync());
		var json = await response.Content.ReadAsStringAsync();
		return JsonSerializer.Deserialize<TokenModel>(json);
	}

	public async Task<UserInfoModel> GetUserInfoAsync(string tokenType, string accessToken) {
		var discovery = await GetDiscoveryModelAsync();
		using var request = new HttpRequestMessage(HttpMethod.Get, discovery.UserInfoEndpoint);
		request.Headers.Authorization = new AuthenticationHeaderValue(tokenType, accessToken);
		var response = await HttpClient.SendAsync(request);
		if (!response.IsSuccessStatusCode)
			throw new InvalidOperationException(await response.Content.ReadAsStringAsync());
		var json = await response.Content.ReadAsStringAsync();
		return JsonSerializer.Deserialize<UserInfoModel>(json);
	}

	public string CreateAccessToken(string userId) => new JwtSecurityTokenHandler()
		.WriteToken(new JwtSecurityToken(
			Issuer,
			Audience,
			new[] { new Claim(UserIdClaimType, userId) },
			signingCredentials: new SigningCredentials(Key, signatureAlgorithm, digestAlgorithm)));
}
